MK=mkdocs

.DEFAULT_GOAL := build

deploy:
	$(MK) gh-deploy -m 'update docs [skip ci]'

build:
	$(MK) build

clean:
	rm -rf site/*

serve:
	$(MK) serve


